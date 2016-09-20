package com.hallila.trycatch.model

import com.fasterxml.jackson.databind.JsonNode
import com.github.kittinunf.fuel.core.FuelManager
import com.github.kittinunf.fuel.core.Method
import com.github.kittinunf.fuel.core.Request
import org.json.JSONArray
import org.json.JSONObject

data class Scenario(val steps: List<Step<*>>) {
    companion object Factory {
        val fuelManager = FuelManager.instance
        fun build(input: Map<String, Any>): Scenario {
            val steps = input.map { entry ->
                val value = entry.key.substringBefore('_').toUpperCase()
                val name = entry.key.substringAfter('_')
                when (StepKey.valueOf(value)) {
                    StepKey.INSERT -> {
                        val values = entry.value as Map<*, *>
                        InsertStep(name, values["statement"] as String, DatabaseResponseExpectation(values["expectation"] as String))
                    }
                    StepKey.REQUEST -> {
                        val values = entry.value as Map<*, *>
                        val request = values["method"] as String
                        val params = values["params"] as Map<*, *>
                        JsonAssertionStep(name, values["payload"] as String,
                            JsonExpectation(values["expectation"] as String),
                            fuelManager.request(Method.valueOf(request.toUpperCase()),
                                values["path"] as String,
                                params.toList() as List<Pair<String, String>>))
                    }
                    StepKey.SELECT -> {
                        val values = entry.value as Map<*, *>
                        SelectStep(name, values["statement"] as String, CsvExpectation(values["expectation"] as List<String>))
                    }
                }
            }
            return Scenario(steps)
        }

        fun buildFromJson(input: JsonNode): Scenario {
            val QUERY = "query"
            val REQUEST = "request"
            val INSERT = "insert"
            val SELECT = "select"
            val EXPECTATION = "expectation"
            val name = "fromTheWeb"
            val steps = input.fields().asSequence().map {
                when (it.key) {
                    REQUEST -> JsonAssertionStep(REQUEST + name, it.value.get("payload").toString(), JsonExpectation(it.value.get("payload").toString()),
                        fuelManager.request(Method.POST, "http://jsonplaceholder.typicode.com/posts/1", emptyList()))

                    INSERT -> InsertStep(INSERT + name, it.value.get(QUERY).toString(), DatabaseResponseExpectation("Done successfully"))

                    SELECT -> SelectStep(SELECT + name, it.value.get(QUERY).toString(), CsvExpectation(it.value.get(EXPECTATION).toString().split("|")))
                    else -> throw RuntimeException("Unable to parse posted JSON :(")
                }
            }.toList()
            return Scenario(steps)
        }
    }
}

data class InsertStep(override val name: String, val statement: String, override val expectation: DatabaseResponseExpectation) : DatabaseStep<String>
data class JsonAssertionStep(override val name: String, val payload: String, override val expectation: JsonExpectation, val request: Request = Request()) : HttpStep<Json>
data class SelectStep(override val name: String, val statement: String, override val expectation: CsvExpectation) : DatabaseStep<List<String>>

data class JsonExpectation(val json: Json) : Expectation<Json> {
    override fun getValue(): Json {
        return json
    }

    constructor(json: String) : this(Json(json))
}

data class CsvExpectation(val rows: List<String>) : Expectation<List<String>> {
    override fun getValue(): List<String> {
        return rows
    }
}

data class DatabaseResponseExpectation(val response: String) : Expectation<String> {
    override fun getValue(): String {
        return response
    }
}

interface Expectation<out T> {
    fun getValue(): T
}

interface DatabaseStep<out T> : Step<T>
interface HttpStep<out T> : Step<T>
interface Step<out T> {
    val name: String
    val expectation: Expectation<T>
}

class Json(val content: String) {
    fun obj(): JSONObject = JSONObject(content)
    fun array(): JSONArray = JSONArray(content)
    override fun toString(): String = obj().toString()
}

enum class StepKey() {
    INSERT, REQUEST, SELECT
}