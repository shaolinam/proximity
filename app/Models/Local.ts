import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Appreciatelocal from './Appreciatelocal'

export default class Local extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public name: string
  @column()
  public lat: number
  @column()
  public lng: number
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

  @hasMany(() => Appreciatelocal, {
    foreignKey: 'localId',
  })
  public appreciatelocals: HasMany<typeof Appreciatelocal>
}
