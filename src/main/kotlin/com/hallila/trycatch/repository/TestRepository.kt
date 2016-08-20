package com.hallila.trycatch.repository


interface TestRepository {
    fun retrieveCases(): List<String>
}