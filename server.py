from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import os

class MyHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Serve files from the 'build' directory
        super().__init__(*args, directory=os.path.join(os.path.dirname(__file__), 'build'), **kwargs)
    
    def do_GET(self):
        # Basic request log to debug incoming calls
        print(f"GET {self.path}")
        # Parse the URL
        parsed_path = urlparse(self.path)
        
        # Check if this is an API request
        if parsed_path.path == '/api/number':
            # Parse query parameters
            query_params = parse_qs(parsed_path.query)
            
            # Get the 'value' parameter
            if 'value' in query_params:
                received_value = query_params['value'][0]
                print(f"Received number: {received_value}") #SPÄTER ERSETZEN für Code um Servo über Arduino Q anzusteuern.
                
                # Send success response
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                response = f'{{"status": "success", "received": {received_value}}}'
                self.wfile.write(response.encode())
            else:
                # Send error response
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"status": "error", "message": "No value provided"}')
        else:
            # Serve static files
            super().do_GET()

def run_server(port=8080):
    server_address = ('', port)
    httpd = HTTPServer(server_address, MyHandler)
    print(f"Server running at http://localhost:{port}")
    print("Press Ctrl+C to stop the server")
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()
