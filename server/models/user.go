package models

import "gorm.io/gorm"

// User 用户表
type User struct {
	gorm.Model
	TrueName string `json:"true_name" validate:"required"`
	Name string		`json:"name" validate:"required"`
	Password string `json:"password" validate:"required"`
	RoomID uint		`json:"room_id"`
}

// Login 登录账号
func Login(name, password string) (user User, err error){
	err = db.Where("name = ? AND password = ?", name, password).First(&user).Error
	return
}

// AddUser 注册账号
func AddUser(user User) (err error) {
	err = db.First(&User{}, "name", user.Name).Error
	if err != nil{
		db.Create(&user)
	}
	return
}

func GetUser(id interface{})(user User, err error){
	err = db.First(&user, id).Error
	return
}

// DeleteUser 注销账号
func (u User)DeleteUser() error{
	return db.Delete(&User{}, u.ID).Error
}
