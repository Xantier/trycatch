package com.hallila.trycatch.handler

import com.fasterxml.jackson.databind.ObjectMapper
import com.hallila.trycatch.WithLogging
import com.hallila.trycatch.service.AssertionService
import com.hallila.trycatch.service.DatabaseService
import com.hallila.trycatch.service.ResponseParsingService
import io.netty.handler.codec.http.HttpResponseStatus
import ratpack.handling.Context
import ratpack.handling.Handler
import ratpack.jackson.Jackson
import ratpack.jackson.Jackson.json
import ratpack.rx.RxRatpack
import javax.inject.Inject
import javax.inject.Singleton


@Singleton class DatabaseInsertHandler @Inject constructor(val service: DatabaseService) : WithLogging(), Handler {
    val exp: String = "Insert statement executed. Response: 1"
    override fun handle(ctx: Context) {
        ctx.parse(Jackson.jsonNode()).map {
            LOG.debug("Got Json {}", it)
            it.get("query").asText()
        }.onError { e ->
            LOG.warn("Failed to parse JSON", e)
            ctx.response.status(HttpResponseStatus.UNPROCESSABLE_ENTITY.code()).send("Failed to Parse JSON: ${e.message}")
        }.then { stmt ->
            RxRatpack.promise(service.insert(stmt))
                .onError { e ->
                    LOG.warn("Failed to run DB insert statement", e)
                    ctx.response.status(HttpResponseStatus.FAILED_DEPENDENCY.code()).send(
                        ObjectMapper().writeValueAsString(mapOf(
                            "result" to "failure",
                            "message" to "Failed to run DB insert statement: ${e.message}"
                        )))
                }
                .then { response ->
                    val result = AssertionService.assertEquals(exp, response.first())
                    ctx.render(json(ResponseParsingService.parseResponse(result)))
                }
        }
    }
}