# NodeJS and Postgress API Starting Project
> With workspaces/groups and mongodb as secondary DB

## TODO:
* Switch to ES7
* Redis or something for better session handling?
* ???

## Setting up a project

 1. Clone this project `git clone ...`
 2. Change repo to your project `git remote set-url origin git@your-project.git`
 3. Change Config `config.*.js` files
 4. Change Descriptions/Names `package.json`
 5. Fix this file `README.md`
 6. Fix `email-service.js` to your emails/project names and `./templates`
 6. `npm install`
 7. `npm run dev-local`
 8. ???
 9. Profit


## Development


#### Header preset

```
Authorization : Authorization Token
Workspace     : Workspace Id
```

### Database Seeding
Use command like this:

* Create one account: `NODE_ENV=development npm run seed account`
 
* Create ten accounts but with `DEV=local`: `NODE_ENV=development npm run seed-local account 10`

### Resource creation
Just run: `npm run create-resource ResourceName`

Which creates all necesery files for you to start making new resource/endpoint