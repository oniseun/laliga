# Bootstrapper App for all possible resources 

This repo attempts to bootstrap all resources and connection needed in any backend application implemeting

- Kafka
- Mongodb
- Posgresql
- Redis Caching 

## How to run the app
```
npm run start:docker
```
# Head to 

```
http://localhost:3000/swagger
```
## Resources to manage data stores

# Run Kafka Ui to manage topics and messages

```
http://127.0.0.1:8080/
```
# Run Redis Commander to manage redis caching

```
http://127.0.0.1:8081/
```

# run postgres admin to manage postgres database

```
http://127.0.0.1:5050/
```

## How to stop the app
```
npm run stop:docker
```

```
docker system prune -f
```