import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Appreciatelocal from 'App/Models/Appreciatelocal'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

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

  public async create({ auth, request, response }) {
    await auth.use('api').authenticate()

    const localSchema = schema.create({
      comment: schema.string({ trim: true }, [rules.minLength(3), rules.maxLength(200)]),
      rating: schema.number([rules.range(1, 5)]),
      userId: schema.number([rules.exists({ table: 'users', column: 'id' })]),
      localId: schema.number([rules.exists({ table: 'locals', column: 'id' })]),
    })

    const data = await request.validate({ schema: localSchema })

    const appreciatelocal = await Appreciatelocal.create(data)

    return response.json(appreciatelocal)
  }
}
