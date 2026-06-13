Feature: As a player I can read a game session

  Background:
    Given I use seed data

  Scenario: I read an open session waiting for an opponent
    When I send a "GET" request to "/api/v1/sessions/01HRESEED000000000000000S1"
    Then the response status should be 200
    And the response body should contain:
      """
      {
        "id": "01HRESEED000000000000000S1",
        "state": "OPEN",
        "firstPlayerId": "01HRESEED0000000000000P101",
        "secondPlayerId": null,
        "currentlyAttackingPlayerId": null,
        "createdAt": "@date('within 1 minute from now')",
        "updatedAt": "@date('within 1 minute from now')"
      }
      """

  Scenario: I read a closed session with both players present
    When I send a "GET" request to "/api/v1/sessions/01HRESEED000000000000000S2"
    Then the response status should be 200
    And the response body should contain:
      """
      {
        "id": "01HRESEED000000000000000S2",
        "state": "CLOSED",
        "firstPlayerId": "01HRESEED0000000000000P201",
        "secondPlayerId": "01HRESEED0000000000000P202",
        "currentlyAttackingPlayerId": "01HRESEED0000000000000P201",
        "createdAt": "@date('within 1 minute from now')",
        "updatedAt": "@date('within 1 minute from now')"
      }
      """

  Scenario: I cannot read a session that does not exist
    When I send a "GET" request to "/api/v1/sessions/01HRESEED00000000000000404"
    Then the response status should be 404
    And the response body should contain:
      """
      {
        "message": "Session with given id does not exist.",
        "error": "Not Found",
        "statusCode": 404
      }
      """

  Scenario: I cannot read a session with a malformed id
    When I send a "GET" request to "/api/v1/sessions/not-a-ulid"
    Then the response status should be 400
    And the response body should contain:
      """
      {
        "message": "Validation failed (ULID is expected)",
        "error": "Bad Request",
        "statusCode": 400
      }
      """
