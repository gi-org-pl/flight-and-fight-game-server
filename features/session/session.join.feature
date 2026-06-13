Feature: As a player I can join a game session

  Background:
    Given I use seed data

  Scenario: I join an open session using its join code
    When I send a "POST" request to "/sessions/000000S1/join" with body:
      """
      {
        "characters": ["IRIS", "SKYE", "SUNNY", "THORA", "VEGA"]
      }
      """
    Then the response status should be 201
    And the response body should contain:
      """
      {
        "sessionId": "01HRESEED000000000000000S1",
        "playerId": "@ulid"
      }
      """

  Scenario: Joining a session makes the initiator attack first
    When I send a "POST" request to "/sessions/000000S1/join" with body:
      """
      {
        "characters": ["IRIS", "SKYE", "SUNNY", "THORA", "VEGA"]
      }
      """
    Then the response status should be 201
    When I send a "GET" request to "/sessions/01HRESEED000000000000000S1"
    Then the response status should be 200
    And the response body should contain:
      """
      {
        "id": "01HRESEED000000000000000S1",
        "state": "CLOSED",
        "firstPlayerId": "01HRESEED0000000000000P101",
        "secondPlayerId": "@ulid",
        "currentlyAttackingPlayerId": "01HRESEED0000000000000P101",
        "createdAt": "@date('within 1 minute from now')",
        "updatedAt": "@date('within 1 minute from now')"
      }
      """

  Scenario: I cannot join a session that is already full
    When I send a "POST" request to "/sessions/000000S2/join" with body:
      """
      {
        "characters": ["IRIS", "SKYE", "SUNNY", "THORA", "VEGA"]
      }
      """
    Then the response status should be 409
    And the response body should contain:
      """
      {
        "message": "Session is not open for joining.",
        "error": "Conflict",
        "statusCode": 409
      }
      """

  Scenario: I cannot join with a join code that matches no session
    When I send a "POST" request to "/sessions/ZZZZZZZZ/join" with body:
      """
      {
        "characters": ["IRIS", "SKYE", "SUNNY", "THORA", "VEGA"]
      }
      """
    Then the response status should be 404
    And the response body should contain:
      """
      {
        "message": "Session with given join code does not exist.",
        "error": "Not Found",
        "statusCode": 404
      }
      """

  Scenario: I cannot join with a malformed join code
    When I send a "POST" request to "/sessions/not-a-ulid/join" with body:
      """
      {
        "characters": ["IRIS", "SKYE", "SUNNY", "THORA", "VEGA"]
      }
      """
    Then the response status should be 400
    And the response body should contain:
      """
      {
        "message": "Validation failed (join code is expected)",
        "error": "Bad Request",
        "statusCode": 400
      }
      """

  Scenario: I cannot join with fewer than 5 characters
    When I send a "POST" request to "/sessions/000000S1/join" with body:
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
