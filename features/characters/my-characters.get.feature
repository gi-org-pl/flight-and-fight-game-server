Feature: As a player I can see my selected characters

  Background:
    Given I use seed data

  Scenario: I see my characters with their stats
    Given I identify as player "01HRESEED0000000000000P201"
    When I send a "GET" request to "/api/v1/my-characters"
    Then the response status should be 200
    And the response body should contain:
      """
      [
        { "type": "IRIS", "stats": { "intelligence": 4, "defense": 3, "power": 3, "health": 5, "refresh": 6 } },
        { "type": "SKYE", "stats": { "intelligence": 5, "defense": 5, "power": 6, "health": 6, "refresh": 6 } },
        { "type": "SUNNY", "stats": { "intelligence": 6, "defense": 4, "power": 7, "health": 5, "refresh": 7 } },
        { "type": "THORA", "stats": { "intelligence": 9, "defense": 6, "power": 8, "health": 8, "refresh": 9 } },
        { "type": "VEGA", "stats": { "intelligence": 8, "defense": 9, "power": 10, "health": 10, "refresh": 5 } }
      ]
      """

  Scenario: I cannot see characters for a player that does not exist
    Given I identify as player "01ARZ3NDEKTSV4RRFFQ69G5FAV"
    When I send a "GET" request to "/api/v1/my-characters"
    Then the response status should be 401
    And the response body should contain:
      """
      {
        "message": "Unauthorized",
        "statusCode": 401
      }
      """

  Scenario: I cannot see characters without identifying myself
    When I send a "GET" request to "/api/v1/my-characters"
    Then the response status should be 401
    And the response body should contain:
      """
      {
        "message": "Unauthorized",
        "statusCode": 401
      }
      """

  Scenario: I cannot see characters with a malformed player id
    Given I identify as player "not-a-ulid"
    When I send a "GET" request to "/api/v1/my-characters"
    Then the response status should be 401
    And the response body should contain:
      """
      {
        "message": "Unauthorized",
        "statusCode": 401
      }
      """
