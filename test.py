from collections import defaultdict

# Sample datetime objects and preferences (replace with your data)
datetime_objects = [
    {'datetime': '2024-03-28 10:00', 'preference': 'high'},
    {'datetime': '2024-03-28 11:00', 'preference': 'medium'},
    {'datetime': '2024-03-28 12:00', 'preference': 'low'},
    # Add more datetime objects as needed
]

# Assign preference levels
preference_levels = {'low': 1, 'medium': 2, 'high': 3}

# Create a dictionary to store total preference levels and counts for each time slot
time_slot_preferences = defaultdict(
    lambda: {'total_preference': 0, 'count': 0})

# Iterate through datetime objects and calculate total preference levels and counts for each time slot
for obj in datetime_objects:
    time_slot = obj['datetime']  # Assuming datetime is the key for time slot
    preference = preference_levels[obj['preference']]
    time_slot_preferences[time_slot]['total_preference'] += preference
    time_slot_preferences[time_slot]['count'] += 1

# Calculate average preference level for each time slot
for time_slot, values in time_slot_preferences.items():
    if values['count'] > 0:
        average_preference = values['total_preference'] / values['count']
        time_slot_preferences[time_slot]['average_preference'] = average_preference
    else:
        time_slot_preferences[time_slot]['average_preference'] = 0

# Find the time slot with the highest average preference level
best_time_slot = max(time_slot_preferences.items(),
                     key=lambda x: x[1]['average_preference'])

print("Best Time Slot:", best_time_slot[0])
print("Average Preference Level:", best_time_slot[1]['average_preference'])
