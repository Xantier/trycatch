package com.hallila.trycatch.handler

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.ArrayNode
import com.github.kittinunf.fuel.core.Method
import com.hallila.trycatch.model.JsonAssertionStep
import com.hallila.trycatch.model.JsonExpectation
import com.hallila.trycatch.model.Request
import okhttp3.MediaType

object JsonHelpers {
    val VALID_JSON = "validJson"
    val PAYLOAD = "payload"
    val EXPECTED = "expectation"
    val URL = "url"
    val METHOD = "method"
    val PARAMS = "params"
    val REQUEST = "request"
    val INSERT = "insert"
    val SELECT = "select"
    val QUERY = "query"
    val EXPECTATION = "expectation"
    val MEDIA_TYPE_JSON: MediaType = MediaType.parse("application/json; charset=utf-8")
}


fun tryParseJson(valid: JsonNode, it: JsonNode?, key: String): String = if (valid.get(key).asBoolean()) it?.get(key)?.toString() ?: "{}" else "{}"

fun parseHttpRequest(it: JsonNode, method: Method): JsonAssertionStep {
    return if (method == Method.GET) {
        JsonAssertionStep("Individual Step", "{\"empty\":\"empty\"}", JsonExpectation(),
            Request(method, it.get(JsonHelpers.URL).asText(), toParamsMap(it.get(JsonHelpers.PARAMS) as ArrayNode)))
    } else {
        val valid = it.get(JsonHelpers.VALID_JSON)
        JsonAssertionStep("Individual Step", tryParseJson(valid, it, JsonHelpers.PAYLOAD), JsonExpectation(tryParseJson(valid, it, JsonHelpers.EXPECTED)),
            Request(method, it.get(JsonHelpers.URL).asText(), toParamsMap(it.get(JsonHelpers.PARAMS) as ArrayNode)))
    }
}

fun httpMethodFromString(s: String): Method = Method.values().find({ it.value == s })!!

fun toParamsMap(params: ArrayNode): Map<String, String> = params.map {
    val KEY = "key"
    val VALUE = "value"
    it.get(KEY).asText() to it.get(VALUE).asText()
}.toMap()
