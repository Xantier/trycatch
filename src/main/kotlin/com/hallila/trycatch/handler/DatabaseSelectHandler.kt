package com.hallila.trycatch.handler

import com.hallila.trycatch.service.AssertionService
import com.hallila.trycatch.service.DatabaseService
import com.hallila.trycatch.service.ResponseParsingService
import ratpack.handling.Context
import ratpack.handling.Handler
import ratpack.jackson.Jackson
import ratpack.rx.RxRatpack
import javax.inject.Inject
import javax.inject.Singleton


@Singleton class DatabaseSelectHandler @Inject constructor(val databaseService: DatabaseService) : Handler {
    override fun handle(ctx: Context) {
        ctx.parse(Jackson.jsonNode()).map {
            it.get("json")
        }.onError {
            println("Failed to parse json out of the request")
            println(it)
        }.then { json ->
            val expected = json.get("expected").asText()
            val statement = json.get("query").asText()
            RxRatpack.promise(databaseService.select(statement)
                .reduce { s1, s2 -> "$s1|$s2" }
                .map { AssertionService.assertEquals(expected, it) }
            ).onError {
                println("Error")
                println(it)
            }.then {
                ctx.response.send(ResponseParsingService.parseResponse(it))
            }
        }
    }
}