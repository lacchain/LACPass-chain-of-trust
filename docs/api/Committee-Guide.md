# Chain of Trust - Committee Procedures

This file contains the necessary steps for the committee to:
* Add a new member into the Public Directory Smart Contract and
* Add a member into the Chain of Trust Smart Contract.

## Requirements
 
* Please follow these [instructions](./Setup-Guide.md) here to make sure you have the required setup before continuing
* The "manager" is the owner of the Public Directory Smart Contract and has also privileges for adding members into the Chain of Trust Smart Contract, so make sure this step is accomplished before continuing.
    * the **manager address** must be the owner of the Public Directory Smart Contract
    * NOTE: if public direcctory has a multisignature owner scheme then this api will not have a method to allow interacting with the public directory.
    * You can verify you have privileges for the Public Directory Smart Contract by checking against the public directory api method, that will return a 200 status code otherwise will throw an exception.
    ```sh
    api_url=http://localhost:3002 # Set LACPass Chain of Trust url
    get_public_directory_manager="$api_url/api/v1/public-directory/get-manager"
    curl -X 'GET' \
    $get_public_directory_manager \
    -H 'accept: application/json'
    ```

* You have access to a terminal from where you can execute some commands to interact with the contracts via the API client.

## Operations

### Onboarding a new member

#### Onboarding the member into the Public Directory

##### requirements
* You must have:
    1. The Certificate Authority
    2. The DID (Decentralized Identifier)
    3. New Member's Metadata

```sh
api_url=http://localhost:3002 # Set LACPass Chain of Trust url
```

```sh
path_to_pulic_cacrt=../certs/SCA/SCA.crt # you should point to the public Certificate Authority pem
validDays=2
expires=true
# metadata
did="did:lac1:1iT6bDHN7nC9yPNuMqtrAPMTE1F9wDJi57G1Q1vL8CfjzuA9rgGdU26oQqV4GhdoLWtu" # New member's DID
legalName="Ministry Of Country ABC"
identificationData='{"id":'\"$did\"',"legalName":'\"$legalName\"'}'
# memberData='{"identificationData":'$identificationData'}'

# process
add_member_to_public_directory_url="$api_url"/api/v1/public-directory/add-member
data='{"validDays":'$validDays', "expires":'$expires',"identificationData":'$identificationData'}'
curl -X 'POST' ${add_member_to_public_directory_url} -H 'accept: application/json' -F caCert=@$path_to_pulic_cacrt -F data=$data
```

#### Onboarding the member into the Chain of Trust
TBD