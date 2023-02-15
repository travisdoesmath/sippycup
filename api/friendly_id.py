# word lists from https://github.com/glitchdotcom/friendly-words

import random

with open('./assets/predicates.txt', 'r') as file:
    predicates = [line.strip() for line in file.readlines()]

with open('./assets/objects.txt', 'r') as file:
    objects = [line.strip() for line in file.readlines()]

def get_id():
    return f'{random.choice(predicates)}-{random.choice(predicates)}-{random.choice(objects)}'