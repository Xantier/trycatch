package com.hallila.trycatch.handler

import com.hallila.trycatch.WithLogging
import com.hallila.trycatch.service.AssertionService
import com.hallila.trycatch.service.DatabaseService
import com.hallila.trycatch.service.ResponseParsingService
import io.netty.handler.codec.http.HttpResponseStatus
import ratpack.handling.Context
import ratpack.handling.Handler
import ratpack.jackson.Jackson
import ratpack.rx.RxRatpack
import javax.inject.Inject
import javax.inject.Singleton


@Singleton class DatabaseSelectHandler @Inject constructor(val databaseService: DatabaseService) : Handler, WithLogging() {
    override fun handle(ctx: Context) {
        ctx.parse(Jackson.jsonNode()).map {
            it.get("json")
        }.onError { e ->
            LOG.warn("Failed to parse JSON", e)
            ctx.response.status(HttpResponseStatus.UNPROCESSABLE_ENTITY.code()).send("Failed to Parse JSON: ${e.message}")
        }.then { json ->
            val expected = json.get("expectation").asText()
            val statement = json.get("query").asText()
            RxRatpack.promise(databaseService.select(statement)
                .reduce { s1, s2 -> "$s1|$s2" }
                .map { AssertionService.assertEquals(expected, it) }
            ).onError { e ->
                LOG.warn("Failed to make request to the database", e)
                ctx.response.status(HttpResponseStatus.FAILED_DEPENDENCY.code()).send("Failed to make request to the database: ${e.message}")
            }.then {
                ctx.response.send(ResponseParsingService.parseResponse(it))
            }
        }
    }
}