package com.hallila.trycatch.model

import com.github.kittinunf.fuel.core.FuelManager
import com.github.kittinunf.fuel.core.Method
import com.github.kittinunf.fuel.core.Request
import org.json.JSONArray
import org.json.JSONObject

data class Scenario(val steps: List<Step<*>>)

data class InsertStep(val statement: String, override val expectation: DatabaseResponseExpectation) : Step<String>

data class JsonAssertionStep(val payload: String, override val expectation: JsonExpectation, val request: Request = Request()) : Step<Json>

data class SelectStep(val statement: String, override val expectation: CsvExpectation) : Step<List<String>>

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

interface Step<out T> {
    val expectation: Expectation<T>
}

interface Expectation<out T> {
    fun getValue(): T
}

class Json(val content: String) {
    fun obj(): JSONObject = JSONObject(content)
    fun array(): JSONArray = JSONArray(content)
}

object ScenarioBuilder {
    fun build(input: Map<String, Any>): Scenario {
        val steps = input.map { entry ->
            val value = entry.key.substringBefore('_').toUpperCase()
            when (StepKey.valueOf(value)) {
                StepKey.INSERT -> {
                    val values = entry.value as Map<String, Any>
                    InsertStep(values["statement"] as String, DatabaseResponseExpectation(values["expectation"] as String))
                }
                StepKey.REQUEST -> {
                    val values = entry.value as Map<String, Any>
                    val request = values["method"] as String
                    val fuelManager = FuelManager.instance
                    val params = values["params"] as Map<String, Any>
                    JsonAssertionStep(values["payload"] as String,
                        JsonExpectation(values["expectation"] as String),
                        fuelManager.request(Method.valueOf(request.toUpperCase()),
                            values["path"] as String,
                            params.toList()))
                }
                StepKey.SELECT -> {
                    val values = entry.value as Map<String, Any>
                    SelectStep(values["statement"] as String, CsvExpectation(values["expectation"] as List<String>))
                }
            }
        }
        return Scenario(steps)
    }
}

enum class StepKey() {
    INSERT, REQUEST, SELECT
}