package com.hallila.trycatch.handler

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.ArrayNode
import com.github.kittinunf.fuel.core.Method
import com.hallila.trycatch.WithLogging
import com.hallila.trycatch.model.JsonAssertionStep
import com.hallila.trycatch.model.JsonExpectation
import com.hallila.trycatch.model.Request
import com.hallila.trycatch.service.AssertionService
import com.hallila.trycatch.service.HttpClientService
import com.hallila.trycatch.service.ResponseParsingService
import io.netty.handler.codec.http.HttpResponseStatus
import ratpack.handling.Context
import ratpack.handling.Handler
import ratpack.jackson.Jackson.jsonNode
import ratpack.rx.RxRatpack
import javax.inject.Inject
import javax.inject.Singleton


@Singleton class HttpRequestHandler @Inject constructor(val client: HttpClientService) : Handler, WithLogging() {
    private val VALID_JSON = "validJson"
    private val PAYLOAD = "payload"
    private val EXPECTED = "expected"
    private val URL = "url"
    private val METHOD = "method"
    private val PARAMS = "params"
    override fun handle(ctx: Context) {
        ctx.parse(jsonNode()).map {
            LOG.debug("Got Json {}", it)
            JsonAssertionStep("Individual Step", tryParseJson(it, PAYLOAD), JsonExpectation(tryParseJson(it, EXPECTED)),
                Request(method(it.get(METHOD).asText()), it.get(URL).asText(), toParamsMap(it.get(PARAMS) as ArrayNode)))
        }.onError { e ->
            LOG.warn("Failed to parse JSON", e)
            ctx.response.status(HttpResponseStatus.UNPROCESSABLE_ENTITY.code()).send("Failed to Parse JSON: ${e.message}")
        }.then { req ->
            RxRatpack.promiseSingle(client.call(req.request, req.payload))
                .onError { e ->
                    LOG.warn("Failed to make request to external API", e)
                    ctx.response.status(HttpResponseStatus.FAILED_DEPENDENCY.code()).send("Failed to make request to external API: ${e.message}")
                }.then { x ->
                val result = AssertionService.assertEquals(req.expectation.value, x)
                ctx.response.send(ResponseParsingService.parseQueryResponse(result))
            }
        }
    }

    private fun tryParseJson(it: JsonNode, key: String) = if (it.get(VALID_JSON).get(key).asBoolean()) it.get(key).toString() else "{}"

    private fun toParamsMap(params: ArrayNode): Map<String, String> = params.map { it.get("key").asText() to it.get("value").asText() }.toMap()

    private fun method(s: String): Method = Method.values().find({ it.value == s })!!
}