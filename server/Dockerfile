FROM golang:1.17

MAINTAINER cjm

ENV GO111MODULE=on \
    CGO_ENABLE=0 \
    GOOS=linux \
    GOARCH=amd64 \
    GOPROXY="https://goproxy.cn,direct"

WORKDIR /wb

COPY . .

# docker build时
RUN go get -u github.com/cosmtrek/air \
    && go mod download \
    && go mod tidy
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

EXPOSE 8080

# docker run时
#ENTRYPOINT ["air"]

