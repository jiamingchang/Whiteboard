package models

import (
	"fmt"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Room struct {
	gorm.Model
	Uid 	uint32	`json:"uid"`
	WhoAdd 	User	`json:"who_add"`
	Users 	[]User	`json:"users"`
	ReadOnly uint	`json:"read_only"`
}

func (u User)CreateRoom(readOnly uint)(re Room){
	var room Room
	room.Uid=uuid.New().ID()
	room.WhoAdd=u
	room.ReadOnly=readOnly
	db.Create(&room)
	db.Preload("WhoAdd").Where("uid", room.Uid).First(&re)
	_ = db.Model(&re).Association("Users").Append(&re.WhoAdd)
	return
}

func GetRoom(uid interface{})(re Room){
	db.Where("uid", uid).First(&re)
	return
}

func (u User)UpdateRoom(readOnly uint)uint{
	var re Room
	db.Model(&Room{}).Preload("WhoAdd").Where("id", u.RoomID).First(&re)
	if re.WhoAdd.ID == u.ID{
		if re.ReadOnly == readOnly{
			return 1
		}
		db.Model(&re).Updates(map[string]interface{}{
			"read_only": readOnly,
		})
		return 2
	}else{
		return 3
	}
}

func (u User)JoinRoom(uid uint32) bool{
	room := GetRoom(uid)
	err := db.Model(&room).Association("Users").Append(&u)
	if err!=nil{
		return false
	}
	return true
}

// GetRoomUser 获取用户所在房间的所有人
func (u User)GetRoomUser() []User{
	var users []User
	var room Room
	db.Where("id", u.RoomID).First(&room)
	_ = db.Model(&room).Association("Users").Find(&users)
	return users
}

// GetRoomer 获取用户所在房间的房主
func (u User)GetRoomer() User{
	var room Room
	db.Model(&Room{}).Preload("WhoAdd").Where("id", u.RoomID).First(&room)
	fmt.Println(room)
	return room.WhoAdd
}

// GetUserRoom 获取用户所在房间
func (u User)GetUserRoom() (Room, bool){
	var room Room
	err := db.Model(&Room{}).Preload("WhoAdd").Where("id", u.RoomID).First(&room).Error
	if err!=nil{
		return room, false
	}
	return room, true
}

// ExitRoom 退出房间
func (u User)ExitRoom() (users []User){
	room, ok := u.GetUserRoom()
	if !ok{
		return
	}
	_ = db.Model(&room).Association("Users").Find(&users)
	if u.ID == room.WhoAdd.ID{
		_ = db.Model(&room).Association("Users").Clear()
		db.Delete(&room)
		return
	}else {
		_ = db.Model(&room).Association("Users").Delete(&u)
		return
	}
}
