package com.hallila.trycatch.repository

import ratpack.exec.Promise


interface TestRepository {
    fun retrieveCases(): List<String>

    fun  insert(statement: Promise<String>): Any
}