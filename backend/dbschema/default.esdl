module default {
    # Define the User type
    type User {
        required property name -> str;
        required property email -> str {
            constraint exclusive;  # Ensures email addresses are unique
        }
        multi link events -> Event;  # Links users to their events
    }

    # Define the Event type
    type Event {
        required title: str;
        property description -> str;
        required property startTime -> datetime;
        required property endTime -> datetime;
        property location -> str;
        required link owner -> User;  # Establishes ownership of an event by a user

        required fixed -> bool {
            default := false;
        }
        required priority -> int16 {
            default := 10;  # priority from 1 to 10; higher value = more priority
        }
    }

    # Define the UserInput type
    type UserInput {
        required property content -> str;  # The actual input from the user
        required property timestamp -> datetime;
        link user -> User;  # Connects the input to a specific user
        link relatedEvent -> Event;  # Optional link to an event, if applicable
    }

    # Define the Recurrence type
    type Recurrence {
        required property pattern -> str;  # e.g., "weekly", "monthly"
        property until -> datetime;  # Optional end date for the recurrence
        link event -> Event;  # Connects recurrence information to an event
    }
}
