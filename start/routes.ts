/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
// import Route from '@ioc:Adonis/Core/Auth'

Route.get('/', async () => {
  return { hello: 'world' }
})

// Users
Route.post('/users', 'UsersController.create')
Route.get('/users', 'UsersController.index')
Route.get('/users/:id', 'UsersController.findById')
Route.get('/users/email/:email', 'UsersController.findByEmail')
Route.put('/users/:id', 'UsersController.update')
Route.delete('/users/:id', 'UsersController.delete')

Route.post('login', 'UsersController.login')
Route.post('logout', 'UsersController.logout')

// Locals
Route.get('/locals/list', 'LocalsController.indexList')
Route.get('/locals/map/:lat/:lng', 'LocalsController.indexMap')
Route.get('/locals/my/list', 'LocalsController.myLocalsList')
Route.get('/locals/my/map/:lat/:lng', 'LocalsController.myLocalsMap')

Route.post('/locals', 'LocalsController.create')

Route.put('/locals', 'LocalsController.update')
Route.delete('/locals', 'LocalsController.delete')

// Ratings
Route.get('/appreciatelocals', 'AppreciatelocalsController.index')
Route.get('/appreciatelocals/:id', 'AppreciatelocalsController.findById')
Route.get('/appreciatelocals/users/:id', 'AppreciatelocalsController.findByUserId')
Route.get('/appreciatelocals/locals/:id', 'AppreciatelocalsController.findByLocalId')
Route.post('/appreciatelocals', 'AppreciatelocalsController.create')
