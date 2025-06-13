package com.sqisoft.gr.core.enums;

import org.springframework.http.HttpStatus;

import lombok.Getter;

/**
 * 애플리케이션 전체에서 사용하는 표준 코드 정의
 */
@Getter
public enum ErrorCode {

	// 인증/인가 (AUTH)
	AUTH_SUCCESS("AUTH_000", "정상 처리되었습니다.", HttpStatus.OK),
	AUTH_INVALID_CREDENTIALS("AUTH_001", "아이디 또는 비밀번호가 올바르지 않습니다.", HttpStatus.UNAUTHORIZED),
	AUTH_ACCESS_DENIED("AUTH_002", "접근 권한이 없습니다.", HttpStatus.FORBIDDEN),
	AUTH_USER_NOT_FOUND("AUTH_003", "존재하지 않는 사용자입니다.", HttpStatus.NOT_FOUND),
	AUTH_REQUIRED("AUTH_004", "인증이 필요한 서비스입니다.", HttpStatus.UNAUTHORIZED),
	AUTH_TOKEN_MISSING("AUTH_005", "인증 토큰이 없습니다.", HttpStatus.UNAUTHORIZED),

	// 접근 제어(ACCESS)
	ACCESS_DENIED("ACCESS_001", "접근이 거부되었습니다.", HttpStatus.FORBIDDEN),
	AUTHENTICATION_CREDENTIALS_NOT_FOUND("ACCESS_002", "인증 정보를 찾을 수 없습니다.", HttpStatus.UNAUTHORIZED),

	// JWT 토큰 (JWT)
	JWT_TOKEN_EXPIRED("JWT_001", "만료된 토큰입니다.", HttpStatus.UNAUTHORIZED),
	JWT_TOKEN_INVALID("JWT_002", "유효하지 않은 토큰입니다.", HttpStatus.UNAUTHORIZED),
	JWT_TOKEN_MALFORMED("JWT_003", "잘못된 형식의 토큰입니다.", HttpStatus.UNAUTHORIZED),
	JWT_REFRESH_TOKEN_EXPIRED("JWT_004", "만료된 리프레시 토큰입니다.", HttpStatus.UNAUTHORIZED),
	JWT_REFRESH_TOKEN_INVALID("JWT_005", "유효하지 않은 리프레시 토큰입니다.", HttpStatus.UNAUTHORIZED),
	JWT_SECRET_KEY_TOO_SHORT("JWT_006", "JWT 시크릿 키 길이가 너무 짧습니다. 현재: %d바이트, 필요: %d바이트",
		HttpStatus.INTERNAL_SERVER_ERROR),
	JWT_TOKEN_REVOKED("JWT_007", "폐기된 토큰입니다.", HttpStatus.UNAUTHORIZED),
	JWT_TOKEN_UNSUPPORTED("JWT_008", "지원되지 않는 토큰 형식입니다.", HttpStatus.UNAUTHORIZED),
	JWT_TOKEN_SIGNATURE_INVALID("JWT_009", "잘못된 토큰 서명입니다.", HttpStatus.UNAUTHORIZED),
	JWT_TOKEN_EMPTY("JWT_010", "토큰이 비어있습니다.", HttpStatus.UNAUTHORIZED),

	// 사용자 관리 (USER)
	USER_SUCCESS("USER_000", "사용자 처리가 완료되었습니다.", HttpStatus.OK),
	USER_ALREADY_EXISTS("USER_001", "이미 등록된 이메일입니다.", HttpStatus.CONFLICT),
	USER_NOT_FOUND("USER_002", "사용자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
	USER_INACTIVE("USER_003", "비활성화된 계정입니다.", HttpStatus.FORBIDDEN),
	USER_INVALID_STATUS("USER_004", "유효하지 않은 사용자 상태입니다.", HttpStatus.BAD_REQUEST),
	USER_DELETE_FAILED("USER_005", "사용자 삭제에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),
	USER_ID_PASSWORD_INVALID("USER_006", "아이디 또는 비밀번호가 올바르지 않습니다.", HttpStatus.UNAUTHORIZED),
	USER_NOT_APPROACH("USER_007", "접근 불가능한 사용자입니다.", HttpStatus.FORBIDDEN),
	USER_OTP_INVALID("USER_008", "인증번호가 일치하지 않습니다.", HttpStatus.UNAUTHORIZED),
	USER_OTP_EXPIRED("USER_009", "인증번호가 만료되었습니다.", HttpStatus.UNAUTHORIZED),
	USER_STTS_CD_NOT_FOUND("USER_010", "사용자 상태 코드를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
	USER_PASSWORD_PASSWORD_NOT_MATCH("USER_011", "비밀번호가 일치하지 않습니다.", HttpStatus.BAD_REQUEST),
	USER_ROLE_SAVE_FAIL("USER_012", "권한부여 실패했습니다.", HttpStatus.BAD_REQUEST),

	// 입력값 검증 (VAL)
	VALIDATION_ERROR("VAL_001", "입력값이 올바르지 않습니다.", HttpStatus.BAD_REQUEST),
	VALIDATION_REQUIRED_MISSING("VAL_002", "필수 입력값이 누락되었습니다.", HttpStatus.BAD_REQUEST),
	VALIDATION_LENGTH_INVALID("VAL_003", "입력값의 길이가 올바르지 않습니다.", HttpStatus.BAD_REQUEST),
	VALIDATION_FORMAT_INVALID("VAL_004", "입력값의 형식이 올바르지 않습니다.", HttpStatus.BAD_REQUEST),

	// 데이터베이스 (DB)
	DB_ERROR("DB_001", "데이터베이스 처리 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),
	DB_DUPLICATE_KEY("DB_002", "중복된 키가 존재합니다.", HttpStatus.CONFLICT),
	DB_CONNECTION_ERROR("DB_003", "데이터베이스 연결에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),

	// 시스템 (SYS)
	SYSTEM_ERROR("SYS_001", "시스템 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),
	SYSTEM_MAINTENANCE("SYS_002", "시스템 점검 중입니다.", HttpStatus.SERVICE_UNAVAILABLE),
	EXTERNAL_API_ERROR("SYS_003", "외부 서비스 연동 중 오류가 발생했습니다.", HttpStatus.SERVICE_UNAVAILABLE),
	UNKNOWN_ERROR_ASK_ADMINISTRATOR("SYS_004", "알 수 없는 오류가 발생했습니다. 관리자에게 문의하세요.", HttpStatus.INTERNAL_SERVER_ERROR),

	// 역할 관리 (ROLE)
	ROLE_NOT_FOUND("ROLE_001", "역할을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
	ROLE_ALREADY_EXISTS("ROLE_002", "역할이 이미 존재합니다.", HttpStatus.CONFLICT),

	// 메뉴 관리 (MENU)
	MENU_NOT_FOUND("MENU_001", "메뉴를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),

	// 메뉴 권한 관리 (MENU_ROLE)
	MENU_UNAUTHORIZED_ACCESS("MENU_ROLE_001", "메뉴에 대한 권한이 없습니다.", HttpStatus.FORBIDDEN),

	// 게시판 관리 (BOARD)
	BOARD_NOT_FOUND("BOARD_001", "게시물을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
	BOARD_SE_CD_NOT_FOUND("BOARD_002", "게시판 구분 코드를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
	BOARD_UNAUTHORIZED_ACCESS("BOARD_003", "게시물에 대한 권한이 없습니다.", HttpStatus.FORBIDDEN),

	// 파일 관리 (FILE)
	FILE_NOT_FOUND("FILE_001", "파일을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
	FILE_UPLOAD_ERROR("FILE_002", "파일 업로드에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),
	FILE_DOWNLOAD_ERROR("FILE_003", "파일 다운로드에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),

	// 엑셀 다운로드 관리 (Excel)
	EXCEL_DOWNLOAD_ERROR("EXCEL_001", "엑셀 다운로드에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),
	EXCEL_DATA_NOT_FOUND("EXCEL_002", "엑셀 다운로드할 데이터가 없습니다.", HttpStatus.NOT_FOUND),
	EXCEL_DATA_WRITE_ERROR("EXCEL_003", "엑셀 데이터 작성 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),

	// 유효성 검사
	VALIDATE_ERROR("VALIDATE_001", "유효성 검사 실패:", HttpStatus.BAD_REQUEST);

	private final String code;
	private final String message;
	private final HttpStatus httpStatus;

	ErrorCode(String code, String message, HttpStatus httpStatus) {
		this.code = code;
		this.message = message;
		this.httpStatus = httpStatus;
	}

	/**
	 * 동적 파라미터를 포함한 에러 메시지 반환
	 *
	 * @param args 메시지에 포함될 파라미터
	 * @return 포맷된 에러 메시지
	 */
	public String getMessage(Object... args) {
		return String.format(message, args);
	}
}
