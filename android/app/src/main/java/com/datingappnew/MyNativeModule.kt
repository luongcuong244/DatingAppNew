package com.datingappnew

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap

class MyNativeModule : ReactContextBaseJavaModule {
    constructor(context: ReactApplicationContext) : super(context) {
        reactContext = context
    }

    override fun getName(): String {
        return "MyNativeModule"
    }

    @ReactMethod
    fun setSecurity(boolean: Boolean) {
        PinActivity.security = boolean
    }

    @ReactMethod
    fun getSecurity(): Boolean {
        return PinActivity.security
    }

    companion object {
        var reactContext: ReactApplicationContext? = null

        fun sendEvent(eventName: String, params: WritableMap?) {
            reactContext
                ?.getJSModule(ReactContext.RCTDeviceEventEmitter::class.java)
                ?.emit(eventName, params)
        }
    }
}