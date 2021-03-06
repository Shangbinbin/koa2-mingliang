import Sequelize from 'sequelize'
import { success } from './index.js'
import House from '../db/house.js'

const { Op } = Sequelize

export const list = async (ctx, next) => {
    const { pageSize, pageNum, provinceId, countryId, keyword } = ctx.query

    let query = {
        limit: pageSize * 1,
        offset: (pageNum - 1) * pageSize,
        where: {

        }
    }


    if (provinceId || countryId) {
        query.where = {
            [Op.and]: [
                { provinceId },
                { countryId }
            ]
        }
    }

    if (keyword) {
        query.where.name = {
            [Op.like]: `%${keyword}%`
        }
    }

    const { count, rows } = await House.findAndCountAll(query)

    ctx.body = success({
        list: rows,
        pages: Math.ceil(count / pageSize)
     })
}

export const detail = async (ctx, next) => {
    const { id } = ctx.params

    const house = await House.findByPk(id)
    ctx.body = success(house)
}

export const create = async (ctx, next) => {
    const { body } = ctx.request
    const house = await House.create(body)
    ctx.body = success(house)
}

export const update = async (ctx, next) => {
    const { id } = ctx.params
    const { body } = ctx.request
    const house = await House.update(body, {
        where:  {
            id
        }
    })

    ctx.body = success(house)
}



