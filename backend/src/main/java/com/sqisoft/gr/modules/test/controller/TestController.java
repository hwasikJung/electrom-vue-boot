package com.sqisoft.gr.modules.test.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sqisoft.gr.core.dto.ApiResponse;
import com.sqisoft.gr.modules.test.dto.TestDto;
import com.sqisoft.gr.modules.test.service.TestService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/test")
public class TestController {

	private final TestService testService;

	@RequestMapping("/test-list")
	public ResponseEntity<ApiResponse<List<TestDto>>> testList() {
		List<TestDto> testList = testService.findAll();
		return ResponseEntity.ok(ApiResponse.success(testList));
	}

}
