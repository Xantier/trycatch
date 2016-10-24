package com.hallila.trycatch.handler

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.ArrayNode
import com.github.kittinunf.fuel.core.Method

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
}


fun tryParseJson(valid: JsonNode, it: JsonNode?, key: String): String = if (valid.get(key).asBoolean()) it?.get(key)?.toString() ?: "{}" else "{}"
fun method(s: String): Method = Method.values().find({ it.value == s })!!
fun toParamsMap(params: ArrayNode): Map<String, String> = params.map {
    val KEY = "key"
    val VALUE = "value"
    it.get(KEY).asText() to it.get(VALUE).asText()
}.toMap()