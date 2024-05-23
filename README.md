
# FBIS Backend Assessment

A solution that would simulate users and allow them to vend a network of their choice.
Considering the product to be Airtime Vending with the network providers (MTN or GLO).


## Installation

create a directory and move into the folder
```bash
  mkdir fbis_valentine_assessment
  cd fbis_valentine_assessment
```

   clone this project
```bash
  git clone https://github.com/chionye/fbis-assessment.git .
``` 
Install dependencies using npm
```bash
  npm install
``` 
create a new mysql database named fbis_airtime_vendor_db

run the app
```bash
  npm run dev 
```

Test that the application works by visiting

```bash
  http://localhost:2020/
``` 

## API Reference

#### Create new user

```http
  POST /api/v1/user/register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**. Your name |
| `email` | `string` | **Required**. Your email |
| `password` | `string` | **Required**. Your password |

#### Purchase Airtime

```http
  POST api/v1/airtime/purchase/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of user |
| `phone`      | `string` | **Required**. phone number of user |
| `network_provider`      | `string` | **Required**. Network provider of user e.g mtn, glo |
| `amount`      | `string` | **Required**. airtime amount to be purchased |
## Authors

- [@chionye](https://github.com/chionye)
Valentine Michael

