from flask import Flask, request, send_file
import cv2
import numpy as np
from PIL import Image
from flask_cors import CORS
import urllib.request
from google.cloud import vision
import io
import os
from google.protobuf.json_format import MessageToDict
import json
from waitress import serve


app = Flask(__name__)
CORS(app)


def gcp_things():
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'gcp.json'
    client = vision.ImageAnnotatorClient()

    path = 'final.png'
    with io.open(path, 'rb') as image_file:
        content = image_file.read()

    image = vision.Image(content=content)

    response = client.text_detection(image=image)

    data_pls = MessageToDict(response._pb)
    # save to json
    with open('_server_gcp.json', 'w') as outfile:
        json.dump(data_pls, outfile)
    board = []
    for i in range(9):
        board.append([])
        for j in range(9):
            board[i].append(0)

    for ob in data_pls['textAnnotations'][1:]:
        num = ob['description']
        i = ob['boundingPoly']['vertices'][0]['y']//60
        j = ob['boundingPoly']['vertices'][0]['x']//60
        for digit in num:
            if digit.isdigit():
                print(i, j, num)
                board[i][j] = int(digit)
            if ob['boundingPoly']['vertices'][1]['x']//60 - ob['boundingPoly']['vertices'][0]['x']//60:
                j += 1
            else:
                i += 1
    for row in board:
        print(row)
    return board


def main(path):

    original_image = cv2.imread(path)
    cp = cv2.imread(path)
    widthImg = 540
    heightImg = 540

    def findBoard(contours):
        areas = [(0, 0)]
        for i in contours:
            area = cv2.contourArea(i)
            if area > 50:
                peri = cv2.arcLength(i, True)
                approx = cv2.approxPolyDP(i, 0.02 * peri, True)
                areas.append((approx, area))
        areas.sort(key=lambda x: x[1], reverse=True)
        return areas[1]

    def reorder(myPoints):
        myPoints = myPoints.reshape((4, 2))
        myPointsNew = np.zeros((4, 1, 2), dtype=np.int32)
        add = myPoints.sum(1)
        myPointsNew[0] = myPoints[np.argmin(add)]
        myPointsNew[3] = myPoints[np.argmax(add)]
        diff = np.diff(myPoints, axis=1)
        myPointsNew[1] = myPoints[np.argmin(diff)]
        myPointsNew[2] = myPoints[np.argmax(diff)]
        return myPointsNew

    imgray = cv2.cvtColor(original_image, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(imgray, 127, 255, 0)
    contours, _ = cv2.findContours(
        thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

    biggest = findBoard(contours)[0]
    biggest = reorder(biggest)

    pts1 = np.float32(biggest)
    pts2 = np.float32([[0, 0], [widthImg, 0], [0, heightImg], [
        widthImg, heightImg]])
    matrix = cv2.getPerspectiveTransform(pts1, pts2)
    imgWarpColored = cv2.warpPerspective(
        cp, matrix, (widthImg, heightImg))
    cv2.imwrite("final.png", imgWarpColored)


@app.route('/',  methods=['POST', 'GET'])
def index():
    print("starting")
    request.files['media'].save("temp.png")
    main("temp.png")
    board = gcp_things()
    for row in board:
        print(row)
    return {"board": board}


@app.route('/hello')
def hello():
    return 'hell D:'


@app.route('/json')
def image():
    return {"image": "https://i.imgur.com/4J0ZQYR.jpg"}


@app.route('/api', methods=['POST'])
def api():
    dataUrl = request.json["dataUrl"]
    print(type(dataUrl), "type")
    response = urllib.request.urlopen(dataUrl)
    with open('_server.jpg', 'wb') as f:
        f.write(response.file.read())
    main("_server.jpg")
    board = gcp_things()

    return {"board": board}
    # return send_file("final.png", mimetype='image/png')


# app.run(host='0.0.0.0', port=81)
serve(app, port=81)
