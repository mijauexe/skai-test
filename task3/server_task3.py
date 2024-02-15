from flask import Flask, request, jsonify

app = Flask(__name__)


def algorithm(start_times, end_times):
    # Zip the elements of the start times with the end times to combine them
    # Then sort them
    intervals = sorted(zip(start_times, end_times), key=lambda x: x[1])


    max_interviews = 0

    # EndTime is not known in the beginning, so we use the smallest possible value because it's always smaller than
    # the beginning start value

    end_time = float('-inf')

    # Iterate over intervals
    for start, end in intervals:
        # If the current interval doesn't overlap with the previous one
        # AND if the end time is larger than the start time (only for error handling)
        if start >= end_time and start <= end:
            max_interviews += 1
            end_time = end

    return max_interviews


@app.route('/', methods=['POST'])
def process_data():
    # Get the JSON data from the request
    data = request.json

    # Ensure that the required fields are present and properly formatted
    if 'start_times' not in data or 'end_times' not in data or len(data['start_times']) != len(data['end_times']):
        return jsonify(
            {
                "error": "Invalid input. 'start_times' and 'end_times' are required fields and they must be the same length",
                'max_interviews': 0
            }
        ), 400

    # Access startTimes and endTimes from the JSON data
    startTimes = data.get('start_times', [])
    endTimes = data.get('end_times', [])

    try:
        num = algorithm(startTimes, endTimes)
        return jsonify({"max_interviews": num}), 200
    except Exception as e:
        # Exception returns server error
        response = {
            "max_interviews": 0,
            "error": "Server Error " + str(e)
        }
        return jsonify(response), 400


if __name__ == '__main__':
    app.run(debug=True, port = 5001)
