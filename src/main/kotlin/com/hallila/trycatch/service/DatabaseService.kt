package com.hallila.trycatch.service

import com.hallila.trycatch.boundary.Repository
import rx.Observable
import javax.inject.Inject
import javax.inject.Singleton

interface DatabaseService {
    fun insert(statement: String): Observable<String>
    fun select(statement: String): Observable<String>
}

@Singleton class DatabaseServiceImpl @Inject constructor(val repository: Repository) : DatabaseService {
    override fun insert(statement: String): Observable<String> =
        repository.insert(statement)

    override fun select(statement: String): Observable<String> =
        repository.select(statement)
}
