NAME=edos-server
GOC=go build

SRC=main.go loop.go

all : $(NAME)

$(NAME):
	$(GOC) -o server $(SRC)

test:
	go run $(SRC) -token $(TOKEN)
