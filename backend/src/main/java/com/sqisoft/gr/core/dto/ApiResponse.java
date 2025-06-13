package com.sqisoft.gr.core.dto;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.sqisoft.gr.core.enums.ErrorCode;

import lombok.Getter;

/**
 * API 공통 응답용 클래스
 */
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
	private final LocalDateTime timestamp = LocalDateTime.now();
	private final String code;
	private final String message;
	private final HttpStatus status;
	private final T data;

	public ApiResponse(String code, String message, HttpStatus status, T data) {
		this.code = code;
		this.message = message;
		this.status = status;
		this.data = data;
	}

	/**
	 * 성공 응답 생성
	 */
	public static <T> ApiResponse<T> success() {
		return new ApiResponse<>(
				HttpStatus.OK.name(),
				"정상 처리되었습니다.",
				HttpStatus.OK,
				null
		);
	}

	/**
	 * 성공 응답 생성 (상태 코드 포함)
	 */
	public static <T> ApiResponse<T> success(HttpStatus status) {
		return new ApiResponse<>(
				status.name(),
				"정상 처리되었습니다.",
				status,
				null
		);
	}

	/**
	 * 성공 응답 생성 (데이터 포함)
	 */
	public static <T> ApiResponse<T> success(T data) {
		return new ApiResponse<>(
				HttpStatus.OK.name(),
				"정상 처리되었습니다.",
				HttpStatus.OK,
				data
		);
	}

	/**
	 * 성공 응답 생성 (상태 코드, 데이터 포함)
	 */
	public static <T> ApiResponse<T> success(HttpStatus status, T data) {
		return new ApiResponse<>(
				status.name(),
				"정상 처리되었습니다.",
				status,
				data
		);
	}

	/**
	 * 에러 응답 생성
	 */
	public static <T> ApiResponse<T> error(ErrorCode errorCode) {
		return new ApiResponse<>(
				errorCode.getCode(),
				errorCode.getMessage(),
				errorCode.getHttpStatus(),
				null
		);
	}

	/**
	 * 에러 응답 생성 (상세 메시지 포함)
	 */
	public static <T> ApiResponse<T> error(ErrorCode errorCode, String detailMessage) {
		return new ApiResponse<>(
				errorCode.getCode(),
				detailMessage,
				errorCode.getHttpStatus(),
				null
		);
	}
}

