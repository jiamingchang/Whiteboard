package middleware

import (
	jwt "github.com/dgrijalva/jwt-go"
	"time"
	"whiteboard/setting"
)

var jwtSecret = []byte(setting.AppSettings.JwtSecret)

type Claims struct {
	UserID 	 string `json:"userid"`
	jwt.StandardClaims
}

// GenerateToken 产生token的函数
func GenerateToken(userid string)(string,error){
	nowTime := time.Now()
	expireTime := nowTime.Add(3 * 24 * time.Hour)

	claims:= Claims{
		userid,
		jwt.StandardClaims{
			ExpiresAt: expireTime.Unix(),
			Issuer: "sztu",
		},
	}

	tokenClaims := jwt.NewWithClaims(jwt.SigningMethodHS256,claims)
	token, err := tokenClaims.SignedString(jwtSecret)

	return token, err
}

// ParseToken 验证token的函数
func ParseToken(token string)(*Claims,error){
	tokenClaims, err := jwt.ParseWithClaims(token,&Claims{},func(token *jwt.Token)(interface{},error){
		return jwtSecret,nil
	})

	if tokenClaims != nil{
		if claims, ok := tokenClaims.Claims.(*Claims);ok && tokenClaims.Valid{
			return claims, nil
		}
	}

	return nil, err
}
