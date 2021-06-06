import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Appreciatelocal from 'App/Models/Appreciatelocal'

export default class AppreciatelocalsController {
  public async index({ auth }: HttpContextContract) {
    await auth.use('api').authenticate()
    const appreciatelocals = await Appreciatelocal.all()
    return appreciatelocals
  }
  public async findById({ auth, request }: HttpContextContract) {
    await auth.use('api').authenticate()
    const id = request.param('id')
    const appreciatelocals = await Appreciatelocal.findOrFail(id)
    return appreciatelocals
  }
  public async findByUserId({ auth, request }: HttpContextContract) {
    await auth.use('api').authenticate()
    const id = request.param('id')
    const appreciatelocals = await Appreciatelocal.query().where('userId', id)
    return appreciatelocals
  }
  public async findByLocalId({ auth, request }: HttpContextContract) {
    await auth.use('api').authenticate()
    const id = request.param('id')
    const appreciatelocals = await Appreciatelocal.query().where('localId', id)
    return appreciatelocals
  }

  public async create({ auth, request }) {
    await auth.use('api').authenticate()
    const { rating, comment, userId, localId } = request.only([
      'rating',
      'comment',
      'userId',
      'localId',
    ])
    const appreciatelocal = await Appreciatelocal.create({ rating, comment, userId, localId })
    return appreciatelocal
  }
}
