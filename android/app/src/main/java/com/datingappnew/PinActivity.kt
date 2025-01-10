package com.datingappnew

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.appcompat.app.AlertDialog

class PinActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_pin)

        findViewById<Button>(R.id.btn_authenticate).setOnClickListener {
            authenticate()
        }

        findViewById<Button>(R.id.btn_logout).setOnClickListener {
            MyNativeModule.sendEvent("logout", null)
            finish()
        }

        authenticate()
    }

    private fun authenticate() {
        // Kiểm tra xem thiết bị có hỗ trợ sinh trắc học không
        val biometricManager = BiometricManager.from(this)
        when (biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_STRONG)) {
            BiometricManager.BIOMETRIC_SUCCESS -> {
                // Nếu có hỗ trợ sinh trắc học, hiển thị prompt để xác thực
                showBiometricPrompt()
            }
            else -> {
                // Nếu không hỗ trợ sinh trắc học, hiển thị prompt để xác thực bằng mật khẩu hoặc mã PIN
                showDeviceCredentialPrompt()
            }
        }
    }

    private fun showBiometricPrompt() {
        val executor = ContextCompat.getMainExecutor(this)

        val biometricPrompt = BiometricPrompt(this, executor, object : BiometricPrompt.AuthenticationCallback() {
            override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                super.onAuthenticationSucceeded(result)
                finish()
            }

            override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                super.onAuthenticationError(errorCode, errString)
                showLogoutDialog()
            }

            override fun onAuthenticationFailed() {
                super.onAuthenticationFailed()
                showLogoutDialog()
            }
        })

        val promptInfo = BiometricPrompt.PromptInfo.Builder()
            .setTitle("Xác thực sinh trắc học")
            .setSubtitle("Sử dụng vân tay hoặc nhận diện khuôn mặt để tiếp tục")
            .setNegativeButtonText("Hủy")
            .setAllowedAuthenticators(BiometricManager.Authenticators.BIOMETRIC_STRONG)
            .build()

        biometricPrompt.authenticate(promptInfo)
    }

    private fun showDeviceCredentialPrompt() {
        val promptInfo = BiometricPrompt.PromptInfo.Builder()
            .setTitle("Xác thực thiết bị")
            .setSubtitle("Nhập mật khẩu hoặc mã PIN của thiết bị để tiếp tục")
            .setAllowedAuthenticators(BiometricManager.Authenticators.DEVICE_CREDENTIAL)
            .build()

        val executor = ContextCompat.getMainExecutor(this)

        val biometricPrompt = BiometricPrompt(this, executor, object : BiometricPrompt.AuthenticationCallback() {
            override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                super.onAuthenticationSucceeded(result)
                finish() // Quay lại ứng dụng
            }

            override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                super.onAuthenticationError(errorCode, errString)
                showLogoutDialog()
            }
        })

        biometricPrompt.authenticate(promptInfo)
    }

    private fun showLogoutDialog() {
        val dialog = AlertDialog.Builder(this)
            .setTitle("Yêu cầu đăng xuất")
            .setMessage("Vui lòng đăng xuất để bảo vệ thông tin cá nhân")
            .setPositiveButton("Đăng xuất") { _, _ ->
                MyNativeModule.sendEvent("logout", null)
                finish()
            }
            .setNegativeButton("Hủy", null)
            .create()
        dialog.show()
    }

    @SuppressLint("MissingSuperCall")
    override fun onBackPressed() {

    }

    companion object {
        var security = false
        var lock = true
        fun start(activity: AppCompatActivity) {
            lock = true
            val intent = Intent(activity, PinActivity::class.java)
            activity.startActivity(intent)
        }
    }
}