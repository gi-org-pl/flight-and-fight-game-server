Feature: As a player I can create a game session

  Background:
    Given I use seed data

  Scenario: I create a new session and become its first player
    When I send a "POST" request to "/api/v1/sessions" with body:
      """
      {
        "characters": ["IRIS", "SKYE", "SUNNY", "THORA", "VEGA"]
      }
      """
    Then the response status should be 201
    And the response body should contain:
      """
      {
        "sessionId": "@ulid",
        "playerId": "@ulid"
      }
      """

  Scenario: I cannot create a session with fewer than 5 characters
    When I send a "POST" request to "/api/v1/sessions" with body:
      """
      {
        "characters": ["IRIS", "SKYE", "SUNNY", "THORA"]
      }
      """
    Then the response status should be 400
    And the response body should contain:
      """
      {
        "statusCode": 400,
        "message": "Request validation failed.",
        "error": "Bad Request",
        "violations": {
          "characters": ["characters must contain at least 5 elements"]
        }
      }
      """

  Scenario: I cannot create a session with duplicate characters
    When I send a "POST" request to "/api/v1/sessions" with body:
      """
      {
        "characters": ["IRIS", "IRIS", "SUNNY", "THORA", "VEGA"]
      }
      """
    Then the response status should be 400
    And the response body should contain:
      """
      {
        "statusCode": 400,
        "message": "Request validation failed.",
        "error": "Bad Request",
        "violations": {
          "characters": ["All characters's elements must be unique"]
        }
      }
      """

  Scenario: I cannot create a session with an unknown character
    When I send a "POST" request to "/api/v1/sessions" with body:
      """
      {
        "characters": ["IRIS", "SKYE", "SUNNY", "THORA", "UNICORN"]
      }
      """
    Then the response status should be 400
    And the response body should contain:
      """
      {
        "statusCode": 400,
        "message": "Request validation failed.",
        "error": "Bad Request",
        "violations": {
          "characters": [
            "each value in characters must be one of the following values: IRIS, ZEPHYR, WENDY, SKYE, SUNNY, AURA, NEIL, GALE, THORA, VEGA"
          ]
        }
      }
      """
