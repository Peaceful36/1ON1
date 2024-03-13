apt-get update
# Install python interpreter
sudo apt-get install python3
# Install pip
sudo apt-get install python3-pip
sudo apt install python3.11-venv
# Create virtual environment
python3 -m venv venv
# Activate virtual environment
source venv/bin/activate
# Install dependencies
pip install -r requirements.txt