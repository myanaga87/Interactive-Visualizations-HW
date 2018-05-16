# import dependencies
from flask import Flask, jsonify, render_template, request
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import pandas as pd

# database setup using automap
engine = create_engine("sqlite:///belly_button_biodiversity.sqlite")

Base = automap_base()

# reflect the tables
Base.prepare(engine, reflect=True)

# Save references to the tables
Data = Base.classes.samples_metadata
Samples = Base.classes.samples
OTU = Base.classes.otu

# Create our session (link) from Python to the DB
session = Session(engine)


# initialize Flask
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///belly_button_biodiversity.sqlite"

@app.route("/")
    # Return the dashboard homepage
def index():
    return render_template("index.html")


@app.route("/names")
    # List of sample names
def sampleNames():
    results = session.query(Data)

    names = []
    for result in results:
        names.append(f"BB_{result.SAMPLEID}")
    return jsonify(names)

@app.route("/otu")
    # List of OTU descriptions
def otus():
    results = session.query(OTU)

    description = []
    for result in results:
        description.append(
            [result.lowest_taxonomic_unit_found])
    return jsonify(description)

@app.route("/metadata/<sample>")
    # MetaData for a given sample
def sample_dict(sample):

    sample = sample.replace("BB_", "")
    
    results = session.query(Data.AGE, Data.BBTYPE, Data.ETHNICITY, Data.GENDER, Data.LOCATION, Data.SAMPLEID).filter(Data.SAMPLEID == sample)

    dict = []
    for result in results:
        sample_dict = {}
        sample_dict["AGE"] = result.AGE
        sample_dict["BBTYPE"] = result.BBTYPE
        sample_dict["ETHNICITY"] = result.ETHNICITY
        sample_dict["GENDER"] = result.GENDER
        sample_dict["LOCATION"] = result.LOCATION
        sample_dict["SAMPLEID"] = result.SAMPLEID
        dict.append(sample_dict)
    
    return jsonify(dict)

@app.route("/wfreq/<sample>")
    # Weekly Washing Frequency as a number
def freq(sample):

    sample = sample.replace("BB_", "")
    
    results = session.query(Data).filter(Data.SAMPLEID == sample)
    frequency = []
    for result in results:
        frequency.append(result.WFREQ)
    return jsonify(frequency)

@app.route("/samples/<sample>")
    # OTU IDs and Sample Values for a given sample
def sorted(sample):
    
    df = pd.read_sql_table("samples", "sqlite:///belly_button_biodiversity.sqlite")
    sort1 = df[sample].sort_values(ascending=False)
    sample_data = df.loc[df[sample] != 0]
    sort2 = sample_data[["otu_id",sample]].sort_values(by=sample, ascending=False)
    top_ten = sample_data[["otu_id",sample]].sort_values(by=sample, ascending=False).head(10)
    final_result = sort2.to_dict(orient='list')
    top_result = top_ten.to_dict(orient='list')
    return jsonify(top_ten.to_dict(orient='list'))

if __name__ == "__main__":
    app.run(debug=True)
