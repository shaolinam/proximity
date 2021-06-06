import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Local from 'App/Models/Local'

export default class LocalsController {
  public async indexList({ auth }: HttpContextContract) {
    await auth.use('api').authenticate()

    let localsLista = await Local.all()
    localsLista = this.sortByName(localsLista)

    return localsLista
  }
  public async myLocalsList({ auth }: HttpContextContract) {
    await auth.use('api').authenticate()

    const { id } = auth.use('api').user || { id: 0 }

    let locals = await Local.query().where('userId', id)

    if (!locals) return []

    locals = this.sortByName(locals)

    return locals
  }
  public async indexMap({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const lat = request.param('lat')
    const lng = request.param('lng')
    const coordinate = lat + ', ' + lng

    if (!this.isValidCoordinates(coordinate))
      return response.status(400).send({ message: 'Coordinate invalid' })

    const locals = await Local.all()

    if (!locals) return []

    const coord = locals.map((l) => {
      const position1 = {
        lat: lat,
        lng: lng,
      }
      const position2 = {
        lat: l.lat,
        lng: l.lng,
      }
      const distance = this.getDistanceFromLatLonInKm(position1, position2)
      return {
        from: {
          lat: lat,
          lng: lng,
        },
        to: {
          lat: l.lat,
          lng: l.lng,
          userId: l.userId,
        },
        distanceMeter: distance,
      }
    })

    const localsMap = this.sortByDistance(coord)

    return localsMap
  }
  public async myLocalsMap({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const lat = request.param('lat')
    const lng = request.param('lng')
    const coordinate = lat + ', ' + lng

    if (!this.isValidCoordinates(coordinate))
      return response.status(400).send({ message: 'Coordinate invalid' })

    const { id } = auth.use('api').user || { id: 0 }
    const locals = await Local.query().where('userId', id)
    const coord = locals.map((l) => {
      const position1 = {
        lat: lat,
        lng: lng,
      }
      const position2 = {
        lat: l.lat,
        lng: l.lng,
      }
      const distance = this.getDistanceFromLatLonInKm(position1, position2)
      return {
        from: {
          lat: lat,
          lng: lng,
        },
        to: {
          lat: l.lat,
          lng: l.lng,
          userId: l.userId,
        },
        distanceMeter: distance,
      }
    })

    const localsMap = this.sortByDistance(coord)

    return localsMap
  }

  public isValidCoordinates(coordinates) {
    if (!coordinates.match(/^[-]?\d+[\.]?\d*, [-]?\d+[\.]?\d*$/)) {
      return false
    }
    const [latitude, longitude] = coordinates.split(',')
    return latitude > -90 && latitude < 90 && longitude > -180 && longitude < 180
  }

  public async create({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const localSchema = schema.create({
      name: schema.string({ trim: true }),
      lat: schema.number(),
      lng: schema.number(),
      userId: schema.number([rules.exists({ table: 'users', column: 'id' })]),
    })

    const data = await request.validate({ schema: localSchema })

    const coordinate = data.lat + ', ' + data.lng

    if (!this.isValidCoordinates(coordinate)) {
      return response.status(400).send({
        errors: [
          {
            rule: 'invalid',
            field: 'lat,lng',
            message: 'Invalid coordinate',
          },
        ],
      })
    }

    const localFind = await Local.findBy('lat', data.lat)

    if (localFind) {
      if (localFind.lng === data.lng) {
        return response.status(400).send({
          errors: [
            {
              rule: 'exists',
              field: 'lat,lng',
              message: 'exists validation failure',
            },
          ],
        })
      }
    }

    const local = await Local.create(data)

    return response.json({ local })
  }
  public async update({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const userToken = auth.use('api').user
    const id = request.param('id')
    const local = await Local.findOrFail(id)
    const { name, lat, lng, userId } = request.only(['name', 'lat', 'lng', 'userId'])

    if (local.userId !== (userToken && userToken.id)) {
      return response.status(403).send({
        errors: [
          {
            rule: 'permission',
            field: 'userId',
            message: 'Forbidden access',
          },
        ],
      })
    } else {
      const coordinate = lat + ', ' + lng
      if (!this.isValidCoordinates(coordinate)) {
        return response.status(400).send({
          errors: [
            {
              rule: 'invalid',
              field: 'lat,lng',
              message: 'Invalid coordinate',
            },
          ],
        })
      }
      local.name = name
      local.lat = lat
      local.lng = lng
      local.userId = userId
      local.save()
      return local
    }
  }
  public async delete({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const id = request.param('id')
    const local = await Local.findOrFail(id)
    const userToken = auth.use('api').user

    if (local.id !== (userToken && userToken.id)) {
      return response.status(403).send({ message: 'Forbidden access!' })
    } else {
      await local.delete()
      return local
    }
  }

  public sortByName(temp: any) {
    if (temp) {
      temp = temp.sort((a, b) => {
        var nameA = a.name.toLowerCase()
        var nameB = b.name.toLowerCase()
        if (nameA < nameB) return -1 //sort string ascending
        if (nameA > nameB) return 1
        return 0 //default return value (no sorting)
      })
    }
    return temp
  }

  public sortByDistance(temp: any) {
    if (temp) {
      temp = temp.sort((a, b) => {
        var distanceA = a.distanceMeter
        var distanceB = b.distanceMeter
        if (distanceA < distanceB) return -1
        if (distanceA > distanceB) return 1
        return 0
      })
    }
    return temp
  }

  public getDistanceFromLatLonInKm(position1, position2) {
    'use strict'
    var deg2rad = function (deg) {
      return deg * (Math.PI / 180)
    }
    var R = 6371
    var dLat = deg2rad(position2.lat - position1.lat)
    var dLng = deg2rad(position2.lng - position1.lng)
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(position1.lat)) *
        Math.cos(deg2rad(position1.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return (R * c * 1000).toFixed()
  }
}
