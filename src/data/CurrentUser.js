let currentUser = {
    userId: 1,
    name: "Lương Cường",
    gender: "Nam",
    city: "Hà Nội",
    age: 19,
    introduce: 'Tôi đã yêu bạn từ giây phút này',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    dateOfBirth: new Date(2002, 10, 10),
    hometown: "Hà Nội",
    hobbies: ['Nghe nhạc', "Xem phim"],
    height: 167,
    weight: 51,
    verify: false,
}

const listPhotos = [
    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    '',
    '',
    '',
    '',
]

module.exports = {
    currentUser,
    listPhotos
}