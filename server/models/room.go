package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Room struct {
	gorm.Model
	Uid 	uint32	`json:"uid"`
	WhoAdd 	uint	`json:"who_add"`
	Users 	[]User	`json:"users"`
	ReadOnly uint	`json:"read_only"`
}

func (u User)CreateRoom(readOnly uint)(re Room){
	var room Room
	room.Uid=uuid.New().ID()
	room.WhoAdd = u.ID
	room.ReadOnly = readOnly
	db.Create(&room)
	db.Where("uid", room.Uid).First(&re)
	_ = db.Model(&re).Association("Users").Append(&u)
	return
}

func GetRoom(uid interface{})(re Room){
	db.Where("uid", uid).First(&re)
	return
}

func (u User)UpdateRoom(readOnly uint)uint{
	var re Room
	db.Model(&Room{}).Where("id", u.RoomID).First(&re)
	if re.WhoAdd == u.ID{
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
	db.Model(&Room{}).Where("id", u.RoomID).First(&room)
	user, _ := GetUser(room.WhoAdd)
	return user
}

// GetUserRoom 获取用户所在房间
func (u User)GetUserRoom() (Room, bool){
	var room Room
	err := db.Model(&Room{}).Preload("Users").Where("id", u.RoomID).First(&room).Error
	if err!=nil{
		return room, false
	}
	return room, true
}

// ExitRoom 退出房间
func (u User)ExitRoom(){
	room, ok := u.GetUserRoom()
	if !ok{
		return
	}
	if u.ID == room.WhoAdd{
		_ = db.Model(&room).Association("Users").Clear()
		db.Delete(&room)
	}else {
		_ = db.Model(&room).Association("Users").Delete(&u)
	}
}
