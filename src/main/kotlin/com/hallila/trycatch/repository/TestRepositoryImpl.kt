package com.hallila.trycatch.repository

import com.google.inject.Inject
import com.google.inject.name.Named
import kotliquery.HikariCP
import kotliquery.queryOf
import kotliquery.sessionOf
import kotliquery.using
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SchemaUtils.create
import org.jetbrains.exposed.sql.transactions.transaction
import ratpack.exec.Promise

class TestRepositoryImpl @Inject constructor(
    @Named("database.url") val dbUrl: String,
    @Named("database.driver") val dbDriver: String,
    @Named("database.user") val user: String,
    @Named("database.password") val password: String) : TestRepository {
    override fun retrieveCases(): List<String> {
        return retrieve().map { it.toString() }
    }

    override fun insert(statement: Promise<String>): Unit {
        statement.then {
            HikariCP.default(dbUrl, user, password)
            using(sessionOf(HikariCP.dataSource())) { session ->
                session.run(queryOf(it).asUpdate)
            }
            Database.connect(dbUrl, driver = dbDriver, user = user, password = password)
            transaction {
                val allCities = Cities.selectAll()
                allCities.forEach { println(it.toString()) }
            }
        }
    }

    fun retrieve(): List<String> {
        Database.connect(dbUrl, driver = dbDriver, user = user, password = password)
        var returnable: List<String> = emptyList()
        transaction {
            create(Cities, Users)

            val saintPetersburgId = Cities.insert {
                it[name] = "St. Petersburg"
            } get Cities.id

            val munichId = Cities.insert {
                it[name] = "Munich"
            } get Cities.id

            Cities.insert {
                it[name] = "Prague"
            }

            Users.insert {
                it[id] = "andrey"
                it[name] = "Andrey"
                it[cityId] = saintPetersburgId
            }

            Users.insert {
                it[id] = "sergey"
                it[name] = "Sergey"
                it[cityId] = munichId
            }

            Users.insert {
                it[id] = "eugene"
                it[name] = "Eugene"
                it[cityId] = munichId
            }

            Users.insert {
                it[id] = "alex"
                it[name] = "Alex"
                it[cityId] = null
            }

            Users.insert {
                it[id] = "smth"
                it[name] = "Something"
                it[cityId] = null
            }

            Users.update({ Users.id eq "alex" }) {
                it[name] = "Alexey"
            }

            Users.deleteWhere { Users.name like "%thing" }

            println("All cities:")

            for (city in Cities.selectAll()) {
                println("${city[Cities.id]}: ${city[Cities.name]}")
            }

            println("Manual join:")
            (Users innerJoin Cities).slice(Users.name, Cities.name).
                select {
                    (Users.id.eq("andrey") or Users.name.eq("Sergey")) and
                        Users.id.eq("sergey") and Users.cityId.eq(Cities.id)
                }.forEach {
                println("${it[Users.name]} lives in ${it[Cities.name]}")
            }

            println("Join with foreign key:")


            (Users innerJoin Cities).slice(Users.name, Users.cityId, Cities.name).
                select { Cities.name.eq("St. Petersburg") or Users.cityId.isNull() }.forEach {
                if (it[Users.cityId] != null) {
                    println("${it[Users.name]} lives in ${it[Cities.name]}")
                } else {
                    println("${it[Users.name]} lives nowhere")
                }
            }

            println("Functions and group by:")

            ((Cities innerJoin Users).slice(Cities.name, Users.id.count()).selectAll().groupBy(Cities.name)).forEach {
                val cityName = it[Cities.name]
                val userCount = it[Users.id.count()]

                if (userCount > 0) {
                    println("$userCount user(s) live(s) in $cityName")
                } else {
                    println("Nobody lives in $cityName")
                }
            }
            val allCities = Cities.selectAll()
            returnable = allCities.map { it.toString() }
        }

        return returnable
    }
}

object Users : Table() {
    val id = varchar("id", 10).primaryKey()
    val name = varchar("name", length = 50)
    val cityId = (integer("city_id") references Cities.id).nullable()
}

object Cities : Table() {
    val id = integer("id").autoIncrement().primaryKey()
    val name = varchar("name", 50)
}
