Feature: As a player I can join a game session

  Background:
    Given I use seed data

  Scenario: I join an open session using its join code
    When I send a "POST" request to "/sessions/000000S1/join"
    Then the response status should be 201
    And the response body should contain:
      """
      {
        "sessionId": "01HRESEED000000000000000S1",
        "playerId": "@ulid"
      }
      """

  Scenario: I cannot join a session that is already full
    When I send a "POST" request to "/sessions/000000S2/join"
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
    When I send a "POST" request to "/sessions/ZZZZZZZZ/join"
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
    When I send a "POST" request to "/sessions/not-a-ulid/join"
    Then the response status should be 400
    And the response body should contain:
      """
      {
        "message": "Validation failed (join code is expected)",
        "error": "Bad Request",
        "statusCode": 400
      }
      """
