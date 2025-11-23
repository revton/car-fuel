package com.carfuel.shared

data class ProblemDetails(
    val title: String,
    val status: Int,
    val code: String,
    val detail: String? = null,
    val instance: String? = null,
    val errors: Map<String, List<String>>? = null
)
