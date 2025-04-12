import pandas as pd
from datetime import datetime, timedelta
import random
import sys

def main():
    # Ensure the script is called with the correct arguments
    if len(sys.argv) != 4:
        print("Usage: python generate_passes.py <year> <month> <day>")
        sys.exit(1)
    
    # Parse the start date from command-line arguments
    year, month, day = map(int, sys.argv[1:4])
    start_date = datetime(year, month, day)
    end_date = start_date + timedelta(weeks=268)
    
    # Load the toll stations data
    tollstations_path = "../tollstations2024.csv"  # Replace with the path to your file
    tollstations = pd.read_csv(tollstations_path)
    
    # Extract toll station IDs and their corresponding Price1 values
    toll_prices = tollstations.set_index("TollID")["Price1"].to_dict()
    valid_toll_ids = list(toll_prices.keys())
    
    # Generate 150 rows of dummy data
    random.seed(42)  # For reproducibility
    generated_data = []
    for _ in range(30000000):
        toll_id = random.choice(valid_toll_ids)
        timestamp = start_date + timedelta(
            seconds=random.randint(0, int((end_date - start_date).total_seconds()))
        )
        tag_ref = ''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', k=10))
        tag_home_id = ''.join([char for char in toll_id if char.isalpha()])
        charge = toll_prices[toll_id]
        
        generated_data.append({
            "timestamp": timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "tollID": toll_id,
            "tagRef": tag_ref,
            "tagHomeID": tag_home_id,
            "charge": f"{charge:.2f}"
        })
    
    # Convert to DataFrame
    generated_df = pd.DataFrame(generated_data)
    
    # Create the output file name dynamically
    output_file = f"passes_{start_date.strftime('%Y%m%d')}_{end_date.strftime('%Y%m%d')}.csv"
    
    # Save the generated data to a CSV file
    generated_df.to_csv(output_file, index=False)
    print(f"Dummy data generated and saved to {output_file}")

if __name__ == "__main__":
    main()


