package com.hallila.trycatch.handler

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ArrayNode
import com.hallila.trycatch.WithLogging
import com.hallila.trycatch.service.AssertionService
import com.hallila.trycatch.service.DatabaseService
import com.hallila.trycatch.service.ResponseParsingService
import io.netty.handler.codec.http.HttpResponseStatus
import ratpack.handling.Context
import ratpack.handling.Handler
import ratpack.jackson.Jackson
import ratpack.rx.RxRatpack
import rx.lang.kotlin.fold
import javax.inject.Inject
import javax.inject.Singleton

data class Select(val expected: List<String>, val statement: String)

@Singleton class DatabaseSelectHandler @Inject constructor(val databaseService: DatabaseService) : Handler, WithLogging() {
    override fun handle(ctx: Context) {
        ctx.parse(Jackson.jsonNode()).map {
            val json = it.get("json")
            val expectation = try {
                val a: ArrayNode = json.get("expectation") as ArrayNode
                a.map { it.asText()}
            } catch (e: Exception) {
                listOf("")
            }
            Select(expectation, json.get("query").asText())
        }.onError { e ->
            LOG.warn("Failed to parse JSON", e)
            ctx.response.status(HttpResponseStatus.UNPROCESSABLE_ENTITY.code()).send("Failed to Parse JSON: ${e.message}")
        }.then { json ->
            RxRatpack.promise(databaseService.select(json.statement)
                .fold("", { s1, s2 -> "$s1\n$s2" })
                .map { AssertionService.assertEquals(json.expected, it) }
            ).onError { e ->
                LOG.warn("Failed to make request to the database", e)
                ctx.response.status(HttpResponseStatus.FAILED_DEPENDENCY.code()).send(
                    ObjectMapper().writeValueAsString(mapOf(
                        "result" to "failure",
                        "message" to "Failed to make request to the database: ${e.message}"
                    )))
            }.then {
                ctx.render(Jackson.json(ResponseParsingService.parseResponse(it)))
            }
        }
    }
}