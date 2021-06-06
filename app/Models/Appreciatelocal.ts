import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Local from './Local'

export default class Appreciatelocal extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public rating: number

  @column()
  public comment: number

  @column()
  public localId: number

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => User, {
    foreignKey: 'userId',
  })
  public user: HasOne<typeof User>

  @hasOne(() => Local, {
    foreignKey: 'localId',
  })
  public local: HasOne<typeof Local>
}
