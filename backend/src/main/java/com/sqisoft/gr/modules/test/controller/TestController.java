package com.sqisoft.gr.modules.test.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

	@GetMapping("/test-list")
	public ResponseEntity<ApiResponse<List<TestDto>>> testList() {
		List<TestDto> testList = testService.findAll();
		return ResponseEntity.ok(ApiResponse.success(testList));
	}

	@PostMapping("/insert-sales-data")
	public ResponseEntity<ApiResponse<TestDto>> insertSalesData(@RequestBody TestDto testDto) {
		log.debug("testDto: {}", testDto);
		testService.insertSalesData(testDto);
		return ResponseEntity.ok(ApiResponse.success(testDto));
	}

	@PostMapping("/bulk-delete-sales-data")
	public ResponseEntity<ApiResponse<Void>> bulkDeleteSalesData(@RequestBody List<Long> ids) {
		log.debug("ids: {}", ids);
		testService.bulkDeleteSalesData(ids);
		return ResponseEntity.ok(ApiResponse.success());
	}

	@PostMapping("/update-sales-data")
	public ResponseEntity<ApiResponse<TestDto>> updateSalesData(@RequestBody TestDto testDto) {
		log.debug("testDto: {}", testDto);
		testService.updateSalesData(testDto); // Assuming this method is used for both insert and update
		return ResponseEntity.ok(ApiResponse.success(testDto));
	}
}
