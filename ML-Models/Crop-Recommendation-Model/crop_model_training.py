import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier, ExtraTreesClassifier, GradientBoostingClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import xgboost as xgb
import lightgbm as lgb
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

class CropPredictionModel:
    def __init__(self):
        self.models = {}
        self.best_model = None
        self.best_model_name = None
        self.label_encoder = LabelEncoder()
        self.feature_columns = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        
    def load_and_preprocess_data(self, file_path):
        """Load and preprocess the dataset"""
        print("Loading dataset...")
        self.df = pd.read_csv(file_path)
        
        print(f"Dataset shape: {self.df.shape}")
        print(f"Features: {self.feature_columns}")
        print(f"Target variable: label")
        print(f"Number of unique crops: {self.df['label'].nunique()}")
        print(f"Crop types: {sorted(self.df['label'].unique())}")
        
        # Check for missing values
        print(f"\nMissing values:\n{self.df.isnull().sum()}")
        
        # Basic statistics
        print(f"\nDataset statistics:")
        print(self.df.describe())
        
        # Encode labels
        self.df['label_encoded'] = self.label_encoder.fit_transform(self.df['label'])
        
        # Prepare features and target
        self.X = self.df[self.feature_columns]
        self.y = self.df['label_encoded']
        
        print(f"\nFeature matrix shape: {self.X.shape}")
        print(f"Target vector shape: {self.y.shape}")
        
        return self.X, self.y
    
    def split_data(self, test_size=0.2, random_state=42):
        """Split data into training and testing sets"""
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(
            self.X, self.y, test_size=test_size, random_state=random_state, stratify=self.y
        )
        print(f"Training set shape: {self.X_train.shape}")
        print(f"Testing set shape: {self.X_test.shape}")
    
    def initialize_models(self):
        """Initialize multiple tree-based models"""
        self.models = {
            'Decision Tree': DecisionTreeClassifier(random_state=42),
            'Random Forest': RandomForestClassifier(random_state=42, n_jobs=-1),
            'Extra Trees': ExtraTreesClassifier(random_state=42, n_jobs=-1),
            'Gradient Boosting': GradientBoostingClassifier(random_state=42),
            'XGBoost': xgb.XGBClassifier(random_state=42, eval_metric='mlogloss'),
            'LightGBM': lgb.LGBMClassifier(random_state=42, verbose=-1)
        }
        print(f"Initialized {len(self.models)} models for comparison")
    
    def train_models(self):
        """Train all models and evaluate their performance"""
        results = {}
        
        print("\nTraining and evaluating models...")
        print("=" * 50)
        
        for name, model in self.models.items():
            print(f"\nTraining {name}...")
            
            # Train the model
            model.fit(self.X_train, self.y_train)
            
            # Make predictions
            y_pred = model.predict(self.X_test)
            
            # Calculate accuracy
            accuracy = accuracy_score(self.y_test, y_pred)
            
            # Cross-validation score
            cv_scores = cross_val_score(model, self.X_train, self.y_train, cv=5, scoring='accuracy')
            cv_mean = cv_scores.mean()
            cv_std = cv_scores.std()
            
            results[name] = {
                'model': model,
                'accuracy': accuracy,
                'cv_mean': cv_mean,
                'cv_std': cv_std,
                'predictions': y_pred
            }
            
            print(f"Accuracy: {accuracy:.4f}")
            print(f"CV Score: {cv_mean:.4f} (+/- {cv_std * 2:.4f})")
        
        return results
    
    def hyperparameter_tuning(self, model_name, model, param_grid):
        """Perform hyperparameter tuning for a specific model"""
        print(f"\nPerforming hyperparameter tuning for {model_name}...")
        
        grid_search = GridSearchCV(
            model, param_grid, cv=5, scoring='accuracy', n_jobs=-1, verbose=1
        )
        grid_search.fit(self.X_train, self.y_train)
        
        print(f"Best parameters: {grid_search.best_params_}")
        print(f"Best CV score: {grid_search.best_score_:.4f}")
        
        return grid_search.best_estimator_
    
    def tune_best_models(self, results):
        """Perform hyperparameter tuning on the top performing models"""
        # Sort models by accuracy
        sorted_results = sorted(results.items(), key=lambda x: x[1]['accuracy'], reverse=True)
        
        # Define parameter grids for tuning
        param_grids = {
            'Random Forest': {
                'n_estimators': [100, 200, 300],
                'max_depth': [10, 20, None],
                'min_samples_split': [2, 5, 10],
                'min_samples_leaf': [1, 2, 4]
            },
            'XGBoost': {
                'n_estimators': [100, 200, 300],
                'max_depth': [3, 6, 10],
                'learning_rate': [0.01, 0.1, 0.2],
                'subsample': [0.8, 0.9, 1.0]
            },
            'LightGBM': {
                'n_estimators': [100, 200, 300],
                'max_depth': [3, 6, 10],
                'learning_rate': [0.01, 0.1, 0.2],
                'num_leaves': [31, 50, 100]
            }
        }
        
        tuned_results = {}
        
        # Tune top 3 models
        for i, (name, result) in enumerate(sorted_results[:3]):
            if name in param_grids:
                tuned_model = self.hyperparameter_tuning(name, result['model'], param_grids[name])
                
                # Evaluate tuned model
                y_pred_tuned = tuned_model.predict(self.X_test)
                accuracy_tuned = accuracy_score(self.y_test, y_pred_tuned)
                
                tuned_results[name] = {
                    'model': tuned_model,
                    'accuracy': accuracy_tuned,
                    'predictions': y_pred_tuned
                }
                
                print(f"Tuned {name} accuracy: {accuracy_tuned:.4f}")
        
        return tuned_results
    
    def select_best_model(self, results):
        """Select the best performing model"""
        best_accuracy = 0
        best_name = None
        
        for name, result in results.items():
            if result['accuracy'] > best_accuracy:
                best_accuracy = result['accuracy']
                best_name = name
        
        self.best_model = results[best_name]['model']
        self.best_model_name = best_name
        
        print(f"\nBest model: {best_name}")
        print(f"Best accuracy: {best_accuracy:.4f}")
        
        return best_name, best_accuracy
    
    def evaluate_model(self, model, y_pred, model_name):
        """Comprehensive model evaluation"""
        print(f"\nDetailed evaluation for {model_name}:")
        print("=" * 50)
        
        # Accuracy
        accuracy = accuracy_score(self.y_test, y_pred)
        print(f"Accuracy: {accuracy:.4f}")
        
        # Classification report
        print(f"\nClassification Report:")
        print(classification_report(self.y_test, y_pred, target_names=self.label_encoder.classes_))
        
        # Feature importance (for tree-based models)
        if hasattr(model, 'feature_importances_'):
            feature_importance = pd.DataFrame({
                'feature': self.feature_columns,
                'importance': model.feature_importances_
            }).sort_values('importance', ascending=False)
            
            print(f"\nFeature Importance:")
            print(feature_importance)
            
            # Plot feature importance
            plt.figure(figsize=(10, 6))
            sns.barplot(data=feature_importance, x='importance', y='feature')
            plt.title(f'Feature Importance - {model_name}')
            plt.tight_layout()
            plt.savefig(f'feature_importance_{model_name.lower().replace(" ", "_")}.png', dpi=300, bbox_inches='tight')
            plt.show()
    
    def save_model(self, model, model_name):
        """Save the trained model and label encoder"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Save model
        model_filename = f'best_crop_model_{timestamp}.pkl'
        joblib.dump(model, model_filename)
        
        # Save label encoder
        encoder_filename = f'label_encoder_{timestamp}.pkl'
        joblib.dump(self.label_encoder, encoder_filename)
        
        print(f"\nModel saved as: {model_filename}")
        print(f"Label encoder saved as: {encoder_filename}")
        
        return model_filename, encoder_filename
    
    def run_complete_training(self, file_path):
        """Run the complete training pipeline"""
        print("Starting Crop Prediction Model Training")
        print("=" * 50)
        
        # Load and preprocess data
        self.load_and_preprocess_data(file_path)
        
        # Split data
        self.split_data()
        
        # Initialize models
        self.initialize_models()
        
        # Train models
        results = self.train_models()
        
        # Tune best models
        print("\n" + "=" * 50)
        print("HYPERPARAMETER TUNING")
        print("=" * 50)
        tuned_results = self.tune_best_models(results)
        
        # Combine original and tuned results
        all_results = {**results, **tuned_results}
        
        # Select best model
        print("\n" + "=" * 50)
        print("FINAL MODEL SELECTION")
        print("=" * 50)
        best_name, best_accuracy = self.select_best_model(all_results)
        
        # Evaluate best model
        best_predictions = all_results[best_name]['predictions']
        self.evaluate_model(self.best_model, best_predictions, best_name)
        
        # Save model
        model_file, encoder_file = self.save_model(self.best_model, best_name)
        
        # Print summary
        print("\n" + "=" * 50)
        print("TRAINING SUMMARY")
        print("=" * 50)
        print(f"Best Model: {best_name}")
        print(f"Best Accuracy: {best_accuracy:.4f}")
        print(f"Model File: {model_file}")
        print(f"Encoder File: {encoder_file}")
        
        return self.best_model, self.label_encoder, best_accuracy

if __name__ == "__main__":
    # Create and run the training pipeline
    trainer = CropPredictionModel()
    best_model, label_encoder, accuracy = trainer.run_complete_training('SIHDataset_Crop_recommend.csv')
    
    print(f"\nTraining completed successfully!")
    print(f"Best model achieved {accuracy:.4f} accuracy")
