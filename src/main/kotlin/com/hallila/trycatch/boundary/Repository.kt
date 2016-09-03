package com.hallila.trycatch.boundary

import com.google.inject.Inject
import com.google.inject.Singleton
import kotliquery.Row
import kotliquery.queryOf
import kotliquery.sessionOf
import kotliquery.using
import ratpack.hikari.HikariService
import rx.Observable
import rx.lang.kotlin.toObservable
import rx.lang.kotlin.toSingletonObservable

interface Repository {
    fun insert(statement: String): Observable<String>
    fun select(statement: String): Observable<String>
}

@Singleton class RepositoryImpl @Inject constructor(val hikari: HikariService) : Repository {

    override fun insert(statement: String): Observable<String> =
        using(sessionOf(hikari.dataSource)) { session ->
            session.run(queryOf(statement).asUpdate)
        }.toSingletonObservable()
            .flatMap { Observable.just("Insert statement executed. Response: $it") }

    override fun select(statement: String): Observable<String> {
        val csv: (Row) -> String = { row ->
            extract(row)
        }
        return using(sessionOf(hikari.dataSource)) { session ->
            session.run(queryOf(statement).map(csv).asList)
        }.toObservable()
    }

    private fun extract(row: Row): String {
        val builder = StringBuilder()
        val columnCount = row.metaDataOrNull().columnCount
        var i = 0
        while (i < columnCount) {
            builder.append(row.string(i + 1))
            if (++i < columnCount) builder.append(",")
        }
        return builder.toString()
    }
}