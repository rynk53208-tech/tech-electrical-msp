# Network Topology Mapper

Cross-platform network scanner for Barney's Tire Shop.

## Usage

### Kali Linux
```bash
pip install python-nmap
chmod +x netmapper.py
./netmapper.py
```

### Windows 11
```cmd
pip install python-nmap
python netmapper.py
```

## Output
- `network-data.json` - Full data in JSON
- `network-data.csv` - Spreadsheet-compatible
- `network-topology.html` - Visual map (open in browser)

## Requirements
- Python 3.7+
- nmap installed on system
- python-nmap: `pip install python-nmap`
